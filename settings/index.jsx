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
      </Section>
    </Page>
  );
}

registerSettingsPage(SettingPage);
