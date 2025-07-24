import type { HonoContext } from "@/ctx";
import { Hono } from "hono";

const companyRouter = new Hono<HonoContext>();

export default companyRouter;
