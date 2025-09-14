package providers

import (
	"log"
	"os"
	"strings"

	"github.com/twilio/twilio-go"
	verify "github.com/twilio/twilio-go/rest/verify/v2"
)

type TwilioProvider struct {
	client    *twilio.RestClient
	verifySid string
}

func NewTwilioProvider() *TwilioProvider {
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: os.Getenv("TWILIO_ACCOUNT_SID"),
		Password: os.Getenv("TWILIO_AUTH_TOKEN"),
	})

	return &TwilioProvider{
		client:    client,
		verifySid: os.Getenv("TWILIO_VERIFY_SID"),
	}
}

// normalizePhone ensures phone is valid for VN (+84...)
func normalizePhone(phone string) string {
	if strings.HasPrefix(phone, "0") {
		return "+84" + phone[1:]
	}
	if strings.HasPrefix(phone, "+") {
		return phone
	}
	if strings.HasPrefix(phone, "84") {
		return "+" + phone
	}
	return "+84" + phone
}

// SendOTP sends a verification code to the user via SMS
func (t *TwilioProvider) SendOTP(to string) error {
	to = normalizePhone(to) // normalize before sending

    if os.Getenv("APP_ENV") == "local" {
        log.Printf("[SendOTP-DEBUG] Sending fake OTP=123456 to phone=%s", to)
        return nil
    }

	params := &verify.CreateVerificationParams{}
	params.SetTo(to)
	params.SetChannel("sms")

	resp, err := t.client.VerifyV2.CreateVerification(t.verifySid, params)
	if err != nil {
		log.Printf("[SendOTP] Failed to send OTP to %s: %v", to, err)
	} else {
		log.Printf("[SendOTP] OTP request sent to phone=%s, sid=%s, status=%s",
			to,
			*resp.Sid,
			*resp.Status,
		)
	}
	return err
}

// VerifyOTP checks if the user-provided code is correct
func (t *TwilioProvider) VerifyOTP(to string, code string) (bool, error) {
	to = normalizePhone(to) // normalize before checking
	
	// Debug mode: accept "123456" without Twilio call
	if os.Getenv("APP_ENV") == "local" {
		if code == "123456" {
			log.Printf("[VerifyOTP-DEBUG] Accepted fake OTP for phone=%s, code=%s", to, code)
			return true, nil
		}
		log.Printf("[VerifyOTP-DEBUG] Rejected invalid fake OTP for phone=%s, code=%s", to, code)
		return false, nil
	}

	params := &verify.CreateVerificationCheckParams{}
	params.SetTo(to)
	params.SetCode(code)

	resp, err := t.client.VerifyV2.CreateVerificationCheck(t.verifySid, params)
	if err != nil {
		log.Printf("[VerifyOTP] Error verifying code for phone=%s, code=%s: %v", to, code, err)
		return false, err
	}

	status := "nil"
	if resp.Status != nil {
		status = *resp.Status
	}

	log.Printf("[VerifyOTP] Phone=%s, code=%s, status=%s", to, code, status)
	return resp.Status != nil && *resp.Status == "approved", nil
}
