package api

import (
	"fmt"
	"net/http"
	"strings"
	"www-api/src/api/errors"
	"www-api/src/model"
)

func (r *router) replyToEmail(res http.ResponseWriter, req *http.Request) {
	var replyEmailRequest model.ReplyEmailRequest
	httpErr := readGetQueryParameters(req, r.context.UrlValuesDecoder, r.context.JsonValidator, &replyEmailRequest)
	if httpErr != nil {
		r.context.Log.Warnf("replyToEmail: error reading params: %v", httpErr.InternalError())
		http.Error(res, httpErr.ErrorCode(), httpErr.StatusCode())
		return
	}

	mailToLink, gmailWebLink, err := r.context.emailService.ReplyToEmail(replyEmailRequest)
	if err != nil {
		httpErr = errors.NewServerError(err)
		r.context.Log.Errorf("replyToEmail: error replying to email: %v", httpErr.InternalError())
		http.Error(res, httpErr.ErrorCode(), httpErr.StatusCode())
		return
	}

	// Create the response HTML page
	responseHtmlLines := []string{
		"<html>",
		"<head>",
		"<title>Reply to Email</title>",
		"<meta charset=\"UTF-8\">",
		"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
		"</head>",
		"<body>",
		"<h1>Reply to Email</h1>",
		fmt.Sprintf("<p><a href=\"%s\">Reply (mailto)</a></p>", mailToLink),
		fmt.Sprintf("<p><a href=\"%s\">Reply (Gmail web)</a></p>", gmailWebLink),
		"</body>",
		"</html>",
	}
	responseHtml := strings.Join(responseHtmlLines, "")
	res.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = res.Write([]byte(responseHtml))
}
