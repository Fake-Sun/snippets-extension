import {z} from 'zod'
import { toTypedSchema } from '@vee-validate/zod';

export const snippetFormSchema = toTypedSchema(z.object({
  name: z.string({ 
    required_error: "Nombre es obligatorio."
  }).min(3, "Nombre necesita al menos 3 caracteres.")
    .max(50, "Nombre no puede contener más de 50 caracteres.")
    // Transform to replace new lines with spaces
    .transform(value => value.replace(/[\r\n]+/g, ' ')),

  shortcut: z.string({
    required_error: "Atajo es obligatorio."
  }).min(2, "Atajo necesita al menos 3 caracteres.")
    .max(20, "Atajo no puede contener más de 20 caracteres.")
    .startsWith('/', "Atajo debe comenzar con \"/\"")
    .toLowerCase()
    .regex(/^\/\S*$/, "Atajo no puede contener espacios."),

  text: z.string({
    required_error: "Texto es obligatorio."
  }).min(2, "Texto debe contener más de 2 caracteres.")
    .max(1000, "Texto no debe contener más de 1000 caracteres.")
}));

export const folderFormSchema = toTypedSchema(z.object({
  name: z.string({
    required_error: "Nombre es obligatorio."
  }).min(3, "Nombre necesita al menos 3 caracteres.")
    .max(50, "Nombre no puede contener más de 20 caracteres.")
    // Transform to replace new lines with spaces
    .transform(value => value.replace(/[\r\n]+/g, ' ')),
  description: z.string().max(200, "Descripción no puede contener más de 200 caracteres.").optional()
}));