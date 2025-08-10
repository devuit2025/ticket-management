package utils

import "time"

// ParseTime parses a time string in the format "2006-01-02 15:04:05"
func ParseTime(s string) time.Time {
	t, err := time.Parse("2006-01-02 15:04:05", s)
	if err != nil {
		return time.Now()
	}
	return t
}
