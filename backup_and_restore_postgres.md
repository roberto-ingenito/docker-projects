# BACKUP

```bash
docker exec cashly-database pg_dump -U user -d cashly_prod -a --column-inserts --exclude-table "\"__EFMigrationsHistory\"" > backup_data.sql
```

# RIPRISTINO

```bash
docker exec -i cashly-database psql -U user -d cashly_prod < backup_data.sql
```
