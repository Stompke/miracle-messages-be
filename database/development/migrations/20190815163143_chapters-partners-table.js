
exports.up = function(knex, Promise) {
  return knex.schema.createTable('chapters_partners', tbl => {
      tbl.increments();

      tbl.integer('chaptersid')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('chapters')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
        
      tbl.integer('partnersid')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('partners')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')  
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('chapters_partners')
};
