package crypto

import "testing"

func TestEncryptAndCompare(t *testing.T) {
	raw := "thisisabadpassword123"
	encrypted, err := Encrypt(raw)
	if err != nil {
		t.Errorf("Encrypt(raw) returned an error")
	}

	if err := Compare(encrypted, raw); err != nil {
		t.Errorf("Compare(encrypted, raw) = true, want false")
	}
}
