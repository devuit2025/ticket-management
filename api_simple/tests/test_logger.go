package tests

import (
	"fmt"
	"strings"
)

// TestLogger provides formatted logging for tests
type TestLogger struct {
	testName string
}

// NewTestLogger creates a new TestLogger
func NewTestLogger(testName string) *TestLogger {
	return &TestLogger{
		testName: testName,
	}
}

// LogTestStart logs the start of a test case
func (l *TestLogger) LogTestStart(description string) {
	fmt.Printf("\n%s\n", strings.Repeat("=", 80))
	fmt.Printf("Starting Test: %s\n", l.testName)
	fmt.Printf("Description: %s\n", description)
	fmt.Printf("%s\n", strings.Repeat("-", 80))
}

// LogTestResult logs the result of a test case
func (l *TestLogger) LogTestResult(response interface{}, err error) {
	fmt.Printf("\nTest Result:\n")
	fmt.Printf("%s\n", strings.Repeat("-", 40))
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Response: %+v\n", response)
	}
	fmt.Printf("%s\n", strings.Repeat("=", 80))
}

// LogStep logs a test step
func (l *TestLogger) LogStep(step string) {
	fmt.Printf("\nStep: %s\n", step)
	fmt.Printf("%s\n", strings.Repeat("-", 40))
}
