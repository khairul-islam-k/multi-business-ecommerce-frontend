"use client";

import UnitForm from "../../_components/UnitForm";

const UpdateUnitPage = () => {
    const unit = {
        name: "Piece",
        status: "ACTIVE" as const,
    };

    const handleUpdateUnit = async (values: UnitPayload) => {
        const payload: UnitPayload = {
            name: values.name.trim(),
            status: values.status,
        };

        console.log("Update unit payload:", payload);
    };

    return (
        <UnitForm
            mode="update"
            initialValues={unit}
            onSubmit={handleUpdateUnit}
        />
    );
};

export default UpdateUnitPage;