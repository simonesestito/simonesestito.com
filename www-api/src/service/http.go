package service

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

type HttpClient interface {
	Post(url string, body interface{}) (response []byte, err error)
}

type httpClient struct {
	client http.Client
}

func NewHttpClient() HttpClient {
	return &httpClient{
		client: http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *httpClient) Post(url string, body interface{}) ([]byte, error) {
	requestBody, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	bodyReader := bytes.NewReader(requestBody)

	request, err := http.NewRequest(http.MethodPost, url, bodyReader)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Content-Type", "application/json")

	response, err := c.client.Do(request)
	defer func() { _ = response.Body.Close() }()

	if response.StatusCode != http.StatusOK {
		return nil, &http.ProtocolError{
			ErrorString: "unexpected status code: " + response.Status,
		}
	}

	return io.ReadAll(response.Body)
}
