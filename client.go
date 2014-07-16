package client

import (
	"encoding/json"
	. "github.com/3ko/warlock-mux"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type options struct {
	Server_uri      string
	Https           bool
	UnsafeBasicAuth bool // Allow Basic Auth over unencrypted HTTP
	Log             bool // Log request and response
}

type Engine struct {
	options options
	Client  *http.Client
}

type Request struct {
	Url    string // Raw URL string
	Method string // HTTP method to use
	// Params    *Params     // URL query parameters
	Payload   interface{} // Data to JSON-encode and POST
	Result    interface{}
	Error     interface{}
	Header    *http.Header
	timestamp time.Time
	status    int
	response  *http.Response
	body      []byte
}
type Response Request

var apiRouter = NewAPIRouter()

func New(options options) *Engine {
	tr := &http.Transport{
		// TLSClientConfig:    &tls.Config{RootCAs: pool},
		DisableCompression: true,
	}
	httpclient := &http.Client{Transport: tr}

	return &Engine{Client: httpclient, options: options}
}

func (c *Engine) get(endpoint string) (error, Response) {
	req := Request{
		Method: "GET",
		Url:    endpoint,
	}
	return c.exec(req)
}

func (c *Engine) exec(r Request) (error, Response) {

	r.Method = strings.ToUpper(r.Method)

	u, err := url.Parse(r.Url)
	if err != nil {
		log.Println(err)
		return
	}

	if r.Params != nil {
		vals := u.Query()
		for k, v := range *r.Params {
			vals.Set(k, v)
		}
		u.RawQuery = vals.Encode()
	}

	header := http.Header{}

	if header.Get("Accept") == "" {
		header.Add("Accept", "application/json") // Default, can be overridden with Opts
	}

	if header.Get("Authrization") == "" && c.options.pkey != nil {
		r.Header.Add("If-None-Match", `W/"wyzzy"`)
	}

	var req *http.Request
	req.Header = header

	// if Engine.Options.Log {
	// 	log.Println("--------------------------------------------------------------------------------")
	// 	log.Println("REQUEST")
	// 	log.Println("--------------------------------------------------------------------------------")
	// 	prettyPrint(req)
	// 	log.Print("Payload: ")
	// 	prettyPrint(r.Payload)
	// }

	resp, err := c.Client.Do(req)

	if err != nil {
		// handle error
	}

	if err != nil {
		log.Println(err)
		return
	}
	defer resp.Body.Close()
	r.status = resp.StatusCode
	r.response = resp

	r.body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return
	}

	if string(r.body) != "" {
		if resp.StatusCode < 300 && r.Result != nil {
			err = json.Unmarshal(r.body, r.Result)
		}
		if resp.StatusCode >= 400 && r.Error != nil {
			json.Unmarshal(r.body, r.Error) // Should we ignore unmarshall error?
		}
	}

}

//User
func (c *Engine) login(user string) (error, Response) {
	return
}

// APP
func (c *Engine) getApplications() (error, Response) {
	return c.get("apps")
}
