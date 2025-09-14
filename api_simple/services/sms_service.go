package services

type SMSService interface {
	Send(to string, body string) error
}