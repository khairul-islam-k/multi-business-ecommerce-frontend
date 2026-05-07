"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Card, Col, Flex, Progress, Row, Table, Tag } from "antd";

const SupplierPerformance = () => {
  const properPerformance = [
    {
      id: 1,
      Supplier: "ABC Textiles",
      "On-Time": 92,
      Quality: 88,
      Defect: 2.5,
      Overall: "Excellent",
    },
    {
      id: 2,
      Supplier: "Global Electronics",
      "On-Time": 85,
      Quality: 95,
      Defect: 0.8,
      Overall: "Excellent",
    },
    {
      id: 3,
      Supplier: "Pak Leather Co.",
      "On-Time": 88,
      Quality: 82,
      Defect: 4.2,
      Overall: "Needs Improvement",
    },
    {
      id: 4,
      Supplier: "Fashion Hub",
      "On-Time": 92,
      Quality: 88,
      Defect: 2.5,
      Overall: "Excellent",
    },
  ];

  const columns = [
    {
      title: "Supplier",
      dataIndex: "Supplier",
      key: "Supplier",
    },
    {
      title: "On-Time (%)",
      dataIndex: "On-Time",
      key: "onTime",
    },
    {
      title: "Quality (%)",
      dataIndex: "Quality",
      key: "Quality",
    },
    {
      title: "Defect Rate (%)",
      dataIndex: "Defect",
      key: "Defect",
    },
    {
      title: "Overall Rating",
      dataIndex: "Overall",
      key: "Overall",
      render: (value: string) => (
        <Tag color={value === "Excellent" ? "green" : "orange"}>{value}</Tag>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <PageHeader
          title="Supplier Performance"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <Row gutter={[15, 15]}>
        {properPerformance.map((singleData) => (
          <Col key={singleData.id} xs={24} md={12}>
            <Card>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {singleData.Supplier}
              </h2>

              <div>
                <Flex justify="space-between">
                  <h3>On-Time</h3>
                  <h3>{singleData["On-Time"]} %</h3>
                </Flex>
                <Progress
                  percent={(singleData["On-Time"] / 100) * 100}
                  showInfo={false}
                  size="medium"
                />
              </div>

              <div>
                <Flex justify="space-between">
                  <h3>Quality</h3>
                  <h3>{singleData.Quality} %</h3>
                </Flex>
                <Progress
                  percent={(singleData.Quality / 100) * 100}
                  showInfo={false}
                  size="medium"
                />
              </div>

              <div>
                <Flex justify="space-between">
                  <h3>Defect</h3>
                  <h3>{singleData.Defect} %</h3>
                </Flex>
                <Progress
                  percent={(singleData.Defect / 100) * 100}
                  showInfo={false}
                  size="medium"
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card style={{ marginTop: "15px" }}>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={properPerformance}
            pagination={false}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default SupplierPerformance;
