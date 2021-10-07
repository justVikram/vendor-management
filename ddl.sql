create table vendors
(
    vendor_name varchar(20) not null
        primary key,
    orders_processed int null
);

create table items
(
    vendor_name varchar(20) null,
    item_name varchar(25) not null,
    constraint items_item_name_uindex
        unique (item_name),
    constraint table_name_vendors_vendor_name_fk
        foreign key (vendor_name) references vendors (vendor_name)
            on update cascade on delete cascade
);

create table transactions
(
    order_id varchar(6) not null
        primary key,
    vendor_name varchar(20) null,
    item_name varchar(20) null,
    quantity int null,
    constraint transactions_items_item_name_fk
        foreign key (item_name) references items (item_name)
            on update cascade on delete cascade,
    constraint transactions_vendors_vendor_name_fk
        foreign key (vendor_name) references vendors (vendor_name)
            on update cascade on delete cascade
);

