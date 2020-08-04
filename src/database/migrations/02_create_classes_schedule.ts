import Knex from "knex";

export async function up(knex: Knex){
    return knex.schema.createTable('classes_schedule', table => {
        table.increments("id").primary();
        table.integer("week_day").notNullable();
        table.integer("from").notNullable();
        table.integer("to").notNullable();
        table.integer("classes_id")
            .notNullable()
            .references("id")
            .inTable("classes")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
    });
}
export async function down(knex: Knex){
    return knex.schema.dropTable("classes_schedule");
}