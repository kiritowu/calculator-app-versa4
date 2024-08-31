function SettingPage(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Currency Conversion Settings</Text>}>
        <Text>
          The currency conversion feature make use of external API to retrieve up-to-date exchange rate information.
          Please register for a free API key from <Link source="https://www.exchangerate-api.com/">ExchangeRate-API</Link> to access the feature.
        </Text>
        <TextInput
          label="API Key"
          settingsKey="apiKey"
        />
        <Select
          label={`Default Base Currency`}
          settingsKey="currencyFrom"
          options={[
            { name: "SGD", value: "0" },
            { name: "MYR", value: "1" },
            { name: "AED", value: "2" },
            { name: "ARS", value: "3" },
            { name: "AUD", value: "4" },
            { name: "BGN", value: "5" },
            { name: "BHD", value: "6" },
            { name: "BRL", value: "7" },
            { name: "CAD", value: "8" },
            { name: "CHF", value: "9" },
            { name: "CLP", value: "10" },
            { name: "CNY", value: "11" },
            { name: "COP", value: "12" },
            { name: "CZK", value: "13" },
            { name: "DKK", value: "14" },
            { name: "EUR", value: "15" },
            { name: "GBP", value: "16" },
            { name: "HKD", value: "17" },
            { name: "HUF", value: "18" },
            { name: "IDR", value: "19" },
            { name: "ILS", value: "20" },
            { name: "INR", value: "21" },
            { name: "JPY", value: "22" },
            { name: "KRW", value: "23" },
            { name: "MXN", value: "24" },
            { name: "NOK", value: "25" },
            { name: "NZD", value: "26" },
            { name: "PEN", value: "27" },
            { name: "PHP", value: "28" },
            { name: "PLN", value: "29" },
            { name: "RON", value: "30" },
            { name: "RUB", value: "31" },
            { name: "SAR", value: "32" },
            { name: "SEK", value: "33" },
            { name: "THB", value: "34" },
            { name: "TRY", value: "35" },
            { name: "TWD", value: "36" },
            { name: "USD", value: "37" },
            { name: "ZAR", value: "38" }
          ]}
        />
        <Select
          label={`Default Converted Currency`}
          settingsKey="currencyTo"
          options={[
            { name: "SGD", value: "0" },
            { name: "MYR", value: "1" },
            { name: "AED", value: "2" },
            { name: "ARS", value: "3" },
            { name: "AUD", value: "4" },
            { name: "BGN", value: "5" },
            { name: "BHD", value: "6" },
            { name: "BRL", value: "7" },
            { name: "CAD", value: "8" },
            { name: "CHF", value: "9" },
            { name: "CLP", value: "10" },
            { name: "CNY", value: "11" },
            { name: "COP", value: "12" },
            { name: "CZK", value: "13" },
            { name: "DKK", value: "14" },
            { name: "EUR", value: "15" },
            { name: "GBP", value: "16" },
            { name: "HKD", value: "17" },
            { name: "HUF", value: "18" },
            { name: "IDR", value: "19" },
            { name: "ILS", value: "20" },
            { name: "INR", value: "21" },
            { name: "JPY", value: "22" },
            { name: "KRW", value: "23" },
            { name: "MXN", value: "24" },
            { name: "NOK", value: "25" },
            { name: "NZD", value: "26" },
            { name: "PEN", value: "27" },
            { name: "PHP", value: "28" },
            { name: "PLN", value: "29" },
            { name: "RON", value: "30" },
            { name: "RUB", value: "31" },
            { name: "SAR", value: "32" },
            { name: "SEK", value: "33" },
            { name: "THB", value: "34" },
            { name: "TRY", value: "35" },
            { name: "TWD", value: "36" },
            { name: "USD", value: "37" },
            { name: "ZAR", value: "38" }
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(SettingPage);
