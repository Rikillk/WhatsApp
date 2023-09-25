import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: 'https://4109936bdc35797a7827c6f7df669b0a@o4505922475524096.ingest.sentry.io/4505922489155584',
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
export { Sentry };

