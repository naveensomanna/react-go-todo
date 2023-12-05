package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	todos := []Todo{}

	// get todos
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	// post todos
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		return c.JSON(todos)

	})

	// patch todos
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {

		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid Id")
		}

		for i, t := range todos {
			if t.ID == id {
				todos[i].Done = true
			}
		}
		return c.JSON(todos)
	})

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	log.Fatal(app.Listen(":4000"))
}
