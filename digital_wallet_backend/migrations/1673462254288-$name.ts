import { MigrationInterface, QueryRunner } from "typeorm"

export class $name1673462254288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`insert into currency (id, description) values (1,'USD');`);
        await queryRunner.query(`insert into currency (id, description) values (2,'EURO');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`delete from currency where id = 1;`);
        await queryRunner.query(`delete from currency where id = 2;`);
    }

}
