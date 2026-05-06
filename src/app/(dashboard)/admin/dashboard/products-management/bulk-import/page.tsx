"use client";

import type { UploadProps } from "antd";
import { Button, Card, Col, Flex, Row, Tag, Upload } from "antd";
import {
  DownloadOutlined,
  FileAddOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import ImportTable from "./_components/import-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Dragger } = Upload;

const BulkImport = () => {
  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,

    customRequest: async ({ file, onError }) => {
      const formData = new FormData();
      formData.append("file", file as Blob);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        console.log("res", res);

        if (!res.ok) throw new Error("Upload failed");
      } catch (error) {
        onError?.(error as Error);
      }
    },
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Product Bulk Import"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
        <p>
          Import products, variants, and pricing data from CSV or Excel files.
        </p>
      </div>

      <Row gutter={[15, 15]}>
        <Col xs={24} md={15}>
          <Card>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Upload File
            </h3>
            <p>Drag and drop or click to upload a CSV/XLSX file</p>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                Drag & drop files here
              </h3>

              <p>Supports CSV and XLSX formats (max 10MB)</p>

              <Tag>
                <Flex
                  justify="center"
                  align="center"
                  style={{ alignItems: "center", gap: "15px" }}
                >
                  <FileAddOutlined />
                  <h3 style={{ margin: "0" }}>Browse file</h3>
                </Flex>
              </Tag>
            </Dragger>
          </Card>
        </Col>

        <Col xs={24} md={9}>
          <Card>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Upload File
            </h3>

            <p>Download the import template to get started</p>

            <Button
              icon={<DownloadOutlined />}
              style={{ marginBottom: "20px" }}
              block
            >
              Products Template (csv.)
            </Button>
            <Button
              style={{ marginBottom: "20px" }}
              icon={<DownloadOutlined />}
              block
            >
              Variants Template (csv.)
            </Button>
            <Button icon={<DownloadOutlined />} block>
              Full Template (csv.)
            </Button>

            <div style={{ marginTop: "10px" }}>
              <p>
                Required columns: name, sku, sale_price. Optional: barcode,
                cost_price, category, status, variant_name.
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <ImportTable />
    </div>
  );
};

export default BulkImport;
