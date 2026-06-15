"use client";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

const ExpenseCategories = () => {
    const [showViewModal, setShowViewModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');


    return (
        <div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowViewModal(true)}
            >
                New Expense Category
            </Button>

            <Modal
                title="View Expense Details"
                open={showViewModal}
                onCancel={() => setShowViewModal(false)}
                footer={null}
            >
                category
            </Modal>
        </div>
    );
};

export default ExpenseCategories;