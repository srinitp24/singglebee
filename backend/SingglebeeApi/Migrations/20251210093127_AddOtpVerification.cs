using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SingglebeeApi.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "phone_verified",
                table: "users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "otp_verifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    user_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    phone_number = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    otp_code = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    purpose = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_verified = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    verified_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    attempt_count = table.Column<int>(type: "int", nullable: false),
                    ip_address = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_otp_verifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_otp_verifications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_otp_verifications_created_at",
                table: "otp_verifications",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_otp_verifications_phone_number",
                table: "otp_verifications",
                column: "phone_number");

            migrationBuilder.CreateIndex(
                name: "IX_otp_verifications_phone_number_purpose_is_verified",
                table: "otp_verifications",
                columns: new[] { "phone_number", "purpose", "is_verified" });

            migrationBuilder.CreateIndex(
                name: "IX_otp_verifications_purpose",
                table: "otp_verifications",
                column: "purpose");

            migrationBuilder.CreateIndex(
                name: "IX_otp_verifications_user_id",
                table: "otp_verifications",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "otp_verifications");

            migrationBuilder.DropColumn(
                name: "phone_verified",
                table: "users");
        }
    }
}
