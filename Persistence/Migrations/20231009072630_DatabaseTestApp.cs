using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseTestApp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           /* migrationBuilder.CreateTable(
                name: "Fb_Informations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    NumberOfInputsVariables = table.Column<int>(type: "INTEGER", nullable: false),
                    Datentyp = table.Column<string>(type: "TEXT", nullable: true),
                    Result = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fb_Informations", x => x.Id);
                });*/

            migrationBuilder.CreateTable(
                name: "DatabaseTestApp",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TestName = table.Column<string>(type: "TEXT", nullable: true),
                    Expected_Value = table.Column<string>(type: "TEXT", nullable: true),
                    ResultFromServer = table.Column<string>(type: "TEXT", nullable: true),
                    ResultComparison = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTestApp", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
/*migrationBuilder.DropTable(
                name: "Fb_Informations");*/

            migrationBuilder.DropTable(
                name: "DatabaseTestApp");
        }
    }
}
