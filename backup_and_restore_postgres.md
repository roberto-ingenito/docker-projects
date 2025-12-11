# BACKUP

```bash
docker exec cashly-database pg_dump -U user -d cashly_prod > backup_cashly_$(date +%Y%m%d).sql
```

# RIPRISTINO

```bash
docker exec -i cashly-database psql -U user -d cashly_prod < backup_cashly.sql
```
