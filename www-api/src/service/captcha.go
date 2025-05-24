package service

type CaptchaService interface {
	IsCaptchaValid(captcha string) (bool, error)
}

type captchaService struct {
	secretKey  string
	httpClient HttpClient
}

func NewCaptchaService(secretKey string, httpClient HttpClient) CaptchaService {
	return &captchaService{
		secretKey:  secretKey,
		httpClient: httpClient,
	}
}

func (s *captchaService) IsCaptchaValid(captcha string) (bool, error) {
	// TODO: Implement the logic to validate the captcha using the secret key and httpClient
	return true, nil
}
