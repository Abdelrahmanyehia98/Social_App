import type z from "zod";
import type { SignUpValidator } from "../../Validators";


export type SignUpBodyType = z.infer<typeof SignUpValidator.body>