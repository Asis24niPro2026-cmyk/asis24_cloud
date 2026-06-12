ALTER TABLE `orders` MODIFY COLUMN `business` enum('Comidería','Papelería','Ropa','Celulares','Masajes','Uñas Acrílicas','Variedades','Examen/Laboratorio','Otros') NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryType` enum('Local','Delivery') NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryAddress` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `address`;