export interface RealTimeWeatherResponse {
  temperatureC: number;
  relativeHumidityPercent: number;
  apparentTempC: number;
  precipitationMm: number;
  windSpeedKmh: number;
  hourlyPrecipitation: number[];
  hourlyTemperature: number[];
  isRealApi: boolean;
}

export async function fetchLiveClimateData(latitude: number, longitude: number): Promise<RealTimeWeatherResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&hourly=temperature_2m,precipitation&timezone=America%2FSao_Paulo&forecast_days=1`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const hourly = data.hourly;

    return {
      temperatureC: Math.round((current.temperature_2m ?? 24.5) * 10) / 10,
      relativeHumidityPercent: Math.round(current.relative_humidity_2m ?? 65),
      apparentTempC: Math.round((current.apparent_temperature ?? 25.0) * 10) / 10,
      precipitationMm: Math.round((current.precipitation ?? 0) * 10) / 10,
      windSpeedKmh: Math.round(current.wind_speed_10m ?? 12),
      hourlyPrecipitation: (hourly.precipitation || []).slice(0, 12),
      hourlyTemperature: (hourly.temperature_2m || []).slice(0, 12),
      isRealApi: true,
    };
  } catch (error) {
    console.warn('[OpenMeteoService] Falha de conexão ou timeout na API externa. Acionando telemetria sintetizada local resiliente:', error);
    // Fallback resiliente baseado nas coordenadas
    const baseTemp = 23 + (Math.abs(latitude) % 5);
    return {
      temperatureC: Math.round(baseTemp * 10) / 10,
      relativeHumidityPercent: 68,
      apparentTempC: Math.round((baseTemp + 1.5) * 10) / 10,
      precipitationMm: 1.2,
      windSpeedKmh: 14,
      hourlyPrecipitation: [0, 0, 0.4, 1.2, 2.5, 3.1, 1.0, 0, 0, 0, 0.2, 0.5],
      hourlyTemperature: [20, 21, 23, 25, 27, 28, 26, 24, 23, 22, 21, 20],
      isRealApi: false,
    };
  }
}
