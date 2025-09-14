package utils

import "strings"

func NormalizePhone(phone string) string {
	// If it starts with 0, replace with +84
	if strings.HasPrefix(phone, "0") {
		return "+84" + phone[1:]
	}
	// If it already starts with +, return as is
	if strings.HasPrefix(phone, "+") {
		return phone
	}
	// Otherwise assume it's missing +84
	return "+84" + phone
}
