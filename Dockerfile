# Use the official MySQL 8.0 image as the base image
FROM mysql:8.0.0

# Set environment variables for MySQL
ENV MYSQL_DATABASE=pixramide
ENV MYSQL_ROOT_PASSWORD=123

# Copy SQL scripts to initialize the database
COPY ./scripts/ /docker-entrypoint-initdb.d/

# Expose port 3306 for MySQL connections
EXPOSE 3306
