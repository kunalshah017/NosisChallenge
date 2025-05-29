import { Hono } from "hono";
import api from "./api";
import topBooks from "./top-books";
import bookDetails from "./details";
import category from "./category";
import type { Env } from "../types/env";

const routes = new Hono<{ Bindings: Env }>();

routes.route("/api", api);
routes.route("/top-books", topBooks);
routes.route("/details", bookDetails);
routes.route("/category", category);

export default routes;
