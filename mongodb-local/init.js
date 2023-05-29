// Connect to the database
db = connect("mongodb://localhost:27017/FEECC-Academy");

// Create required collections
db.createCollection("employeeData");
db.createCollection("productionSchemas");
db.createCollection("productionStagesData");
db.createCollection("unitData");

// Generate indexes for quicker access
db.employeeData.createIndex(
    {
        rfid_card_id: "text"
    }
);
db.productionSchemas.createIndex(
    {
        schema_id: "text",
        parent_schema_id: 1
    }
);
db.productionStagesData.createIndex(
    {
        id: 1,
        parent_unit_uuid: "text"
    }
);
db.unitData.createIndex(
    {
        internal_id: "text",
        uuid: 1,
        status: 1
    }
);

db.employeeData.insertOne(
    {
        "name": "Сотрудник 1",
        "passport_code": "e9b69b302f72d82ca47964196536aab3f36e367910aff06d2be30888f9ad4234",
        "position": "Тестовый сотрудник",
        "rfid_card_id": "1111111111",
    }
);

db.productionSchemas.insertMany(
    [
        {
            "parent_schema_id": null,
            "required_components_schema_ids": null,
            "schema_id": "2d31e86160d74c6cb6ce83bf249bc853",
            "schema_type": "Обычный",
            "unit_name": "Обычное устройство",
            "production_stages": [
                {
                    "name": "Подготовка инструментов",
                    "type": "Подготовка",
                    "description": "Открыть ящик с инструментами, достать пилу.",
                    "equipment": ["Ящик с инструментами"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "319419766d5a4e42b45577d008597191",
                },
                {
                    "name": "Распилить устройство",
                    "type": "Разборка",
                    "description": "Разделить устройство на две части, используя пилу.",
                    "equipment": ["Пила"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "92e4c369efae4af580f8f97ff0251d11",
                },
                {
                    "name": "Уборка инструментов",
                    "type": "Завершение",
                    "description": "Сложить использованный инструмент в ящик.",
                    "equipment": ["Ящик с инструментами"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "f11db2de25994e9280a404240ebed582",
                },
            ],
        },
        {
            "parent_schema_id": null,
            "required_components_schema_ids": null,
            "schema_id": "3fa0cb87bdfc4438a4236d31aa6742be",
            "schema_type": "Компонент",
            "unit_name": "Компонент составного устройства",
            "production_stages": [
                {
                    "name": "Подготовка инструментов",
                    "type": "Подготовка",
                    "description": "Открыть ящик с инструментами, достать молоток и отвертку.",
                    "equipment": ["Ящик с инструментами"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "0f27b91ac8654eda8efb25e5125ed93b",
                },
                {
                    "name": "Сборка компонента",
                    "type": "Сборка",
                    "description": "Собрать компонент согласно интрукции.",
                    "equipment": ["Отвертка", "Молоток"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "d79f608508c74a8ea7c45b76efece198",
                },
                {
                    "name": "Уборка инструментов",
                    "type": "Завершение",
                    "description": "Сложить использованный инструмент в ящик.",
                    "equipment": ["Ящик с инструментами"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "ab62b33e3acf44e192479429d721fca9",
                },
            ],
        },
        {
            "parent_schema_id": null,
            "required_components_schema_ids": ["3fa0cb87bdfc4438a4236d31aa6742be"],
            "schema_id": "bb52b37d783a4e419a2535c069f9f7e0",
            "schema_type": "Составное устройство",
            "unit_name": "Составное устройство",
            "production_stages": [
                {
                    "name": "Подготовка инструментов",
                    "type": "Подготовка",
                    "description": "Открыть ящик с инструментами, достать скот",
                    "equipment": ["Ящик с инструментами"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "a8aa91bf34ec4fee95a0a2bdd2ee17b7",
                },
                {
                    "name": "Прикрепить компонент к основанию",
                    "type": "Сборка",
                    "description": "Прикрепить компонент к основанию при помощи скотча.",
                    "equipment": ["Скотч"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "8abef8b8cd2e476e8d3e7f0845b7ba2c",
                },
                {
                    "name": "Уборка инструментов",
                    "type": "Завершение",
                    "description": "Сложить использованный инструмент в ящик.",
                    "equipment": ["Ящик с инструментами"],
                    "workplace": "Сборочный стол",
                    "duration_seconds": 0,
                    "stage_id": "5a83cbe24e224329ac959725565bdf65",
                },
            ],
        },
    ]
);
