import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const today = new Date();

const schema = yup.object().shape({
  name: yup
    .string()
    .min(8, "Le nom doit contenir au moins 8 caractères")
    .max(15, "Le nom ne peut pas dépasser 15 caractères")
    .required("Le nom est requis"),
  dueDate: yup
    .string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Le format doit être jj/mm/AAAA")
    .test(
      "is-valid-date",
      "La date ne peut pas être antérieure à aujourd'hui",
      (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("/").map(Number);
        const inputDate = new Date(year, month - 1, day);
        return inputDate >= today;
      }
    )
    .required("La date est requise"),
  priority: yup
    .string()
    .oneOf(["Basse", "Moyenne", "Élevée"], "Choisissez une priorité valide"),
  isCompleted: yup.boolean().required(),
});

export const App = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <Container className="mt-4">
      <h2>Ajouter une tâche</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" {...register("name")} />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="dueDate">
          <Form.Label>Date Due</Form.Label>
          <Form.Control
            type="text"
            placeholder="jj/mm/AAAA"
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p className="text-danger">{errors.dueDate.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="priority">
          <Form.Label>Priorité</Form.Label>
          <Form.Select {...register("priority")}>
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Élevée">Élevée</option>
          </Form.Select>
          {errors.priority && (
            <p className="text-danger">{errors.priority.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="isCompleted">
          <Form.Check
            type="checkbox"
            label="Tâche complétée"
            {...register("isCompleted")}
          />
          {errors.isCompleted && (
            <p className="text-danger">{errors.isCompleted.message}</p>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Ajouter
        </Button>
      </Form>
    </Container>
  );
};
