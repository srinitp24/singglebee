using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SingglebeeApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderShippingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "orders",
                keyColumn: "shipping_address",
                keyValue: null,
                column: "shipping_address",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "shipping_address",
                table: "orders",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ShippingCity",
                table: "orders",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ShippingCountry",
                table: "orders",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ShippingPostalCode",
                table: "orders",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ShippingState",
                table: "orders",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShippingCity",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "ShippingCountry",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "ShippingPostalCode",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "ShippingState",
                table: "orders");

            migrationBuilder.AlterColumn<string>(
                name: "shipping_address",
                table: "orders",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldMaxLength: 500)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
