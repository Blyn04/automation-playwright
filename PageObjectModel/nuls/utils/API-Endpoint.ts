import { expect, Page, Response } from "@playwright/test";

export class Endpoint {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertEndpoint(statusCode: number, endpointPath: string, page?: Page) {
    const activePage = page || this.page;
    let response: Response | null = null;

    try {
      response = await activePage.waitForResponse((res) =>
        res.url().includes(endpointPath),
      );
    } catch (error) {
      console.log(`Could not capture response for: ${endpointPath}: ${error}`);
      throw error;
    }

    try {
      if (!response) {
        throw new Error(`No response captured for ${endpointPath}`);
      }
      if (response.status() !== statusCode) {
        await this.logResponseBody(response, endpointPath);
        throw new Error(
          `Status code mismatch for: ${endpointPath} \nExpected: ${statusCode} \nActual: ${response.status()}`,
        );
      }
      console.log(
        `Successfully captured response for: ${endpointPath} with status code ${response.status()}`,
      );
    } catch (error) {
      console.error(`Error asserting : ${endpointPath}\n${error}`);
      throw error;
    }
    return response;
  }

  private async logResponseBody(response: Response, endpointPath: string) {
    try {
      const body = await response.text();
      try {
        const parsed = JSON.parse(body);
        const pretty = JSON.stringify(parsed, null, 2);
        console.log(`Response body for ${endpointPath}:\n${pretty}`);
      } catch {
        console.log(`Response body (RAW): ${body}`);
      }
    } catch {
      console.log(`Unable to read response body for ${Endpoint}`);
    }
  }
}
