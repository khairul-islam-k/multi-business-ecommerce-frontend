import { Card, Col, Row } from "antd";

const ReportCard = () => {
  const reports = [
    { id: 1, source: "Website", sourceCount: 2 },
    { id: 2, source: "Facebook", sourceCount: 2 },
    { id: 3, source: "Walk in", sourceCount: 1 },
    { id: 4, source: "Instagram", sourceCount: 1 },
    { id: 5, source: "Google Ads", sourceCount: 1 },
    { id: 6, source: "Referral", sourceCount: 1 },
  ];
  return (
    <div style={{ marginBottom: "10px" }}>
      <Row gutter={[16, 16]}>
        {reports.map((report) => (
          <Col xs={12} lg={4} key={report.id}>
            <Card style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {report.sourceCount}
              </h3>
              <p>{report.source}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ReportCard;
