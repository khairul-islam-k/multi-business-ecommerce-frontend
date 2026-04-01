"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Grid, Input, Select } from "antd";
import { useState } from "react";
import VariantHeader from "./components/VariantHeader";
import VariantTable from "./components/VariantTable";

const { Option } = Select;

const VariantManagement = () => {
    const screens = Grid.useBreakpoint();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [packageFilter, setPackageFilter] = useState("all");

    return (
        <div>

            <VariantHeader />
            
            <Card>
                    <div
                    //  className="flex overflow-auto gap-2 mb-4"
                    style={{display: 'flex', flexWrap: screens.xs ? 'wrap': 'initial', gap: '8px'}}
                     >
                        <Input
                            placeholder="Filter by name or email..."
                            prefix={<SearchOutlined />}
                            style={{ maxWidth: 280 }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Select
                            value={statusFilter}
                            style={{ width: 140 }}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="Active">Active</Option>
                            <Option value="Trial">Trial</Option>
                            <Option value="Suspended">Suspended</Option>
                        </Select>

                        <Select
                            value={packageFilter}
                            style={{ width: 140 }}
                            onChange={setPackageFilter}
                        >
                            <Option value="all">All Packages</Option>
                            <Option value="Starter">Starter</Option>
                            <Option value="Growth">Growth</Option>
                            <Option value="Enterprise">Enterprise</Option>
                        </Select>
                    </div>

                {/* Table */}
                <VariantTable />

            </Card>
        </div>
    );
};

export default VariantManagement;