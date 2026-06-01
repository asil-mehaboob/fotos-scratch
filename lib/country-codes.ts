export interface CountryCode {
  code: string;
  dial: string;
  flag: string;
  label: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "IN", dial: "+91",  flag: "🇮🇳", label: "India" },
  { code: "US", dial: "+1",   flag: "🇺🇸", label: "USA" },
  { code: "GB", dial: "+44",  flag: "🇬🇧", label: "UK" },
  { code: "AE", dial: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "SG", dial: "+65",  flag: "🇸🇬", label: "Singapore" },
  { code: "AU", dial: "+61",  flag: "🇦🇺", label: "Australia" },
  { code: "CA", dial: "+1",   flag: "🇨🇦", label: "Canada" },
  { code: "MY", dial: "+60",  flag: "🇲🇾", label: "Malaysia" },
  { code: "NZ", dial: "+64",  flag: "🇳🇿", label: "New Zealand" },
  { code: "ZA", dial: "+27",  flag: "🇿🇦", label: "South Africa" },
  { code: "DE", dial: "+49",  flag: "🇩🇪", label: "Germany" },
  { code: "FR", dial: "+33",  flag: "🇫🇷", label: "France" },
  { code: "LK", dial: "+94",  flag: "🇱🇰", label: "Sri Lanka" },
  { code: "PK", dial: "+92",  flag: "🇵🇰", label: "Pakistan" },
  { code: "BD", dial: "+880", flag: "🇧🇩", label: "Bangladesh" },
  { code: "NP", dial: "+977", flag: "🇳🇵", label: "Nepal" },
  { code: "PH", dial: "+63",  flag: "🇵🇭", label: "Philippines" },
  { code: "NG", dial: "+234", flag: "🇳🇬", label: "Nigeria" },
  { code: "KE", dial: "+254", flag: "🇰🇪", label: "Kenya" },
  { code: "BR", dial: "+55",  flag: "🇧🇷", label: "Brazil" },
];
