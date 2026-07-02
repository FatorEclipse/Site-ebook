import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Protege endpoints caros (geração com IA) contra abuso: 5 gerações a cada 10 minutos por usuário.
// Ajuste a janela conforme o plano do usuário (free vs pro vs business) se necessário.
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "bookforge:ratelimit",
});
