import React from "react";
import { Card, Grid, theme } from "antd";
import { CarOutlined, GlobalOutlined, HomeOutlined } from "@ant-design/icons";

const ChargeCard = () => {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: screens.xs ? "repeat(1, 1fr)" : "repeat(3, 1fr)",
        gap: "10px",
        marginBottom: "10px",
      }}
    >
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: token.colorBgContainerDisabled,
              height: "50px",
              width: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <HomeOutlined style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>Rs 142</h3>
            <p>Avg Inside City</p>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: token.colorBgContainerDisabled,
              height: "50px",
              width: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <CarOutlined style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>Rs 300</h3>
            <p>Avg Outside City</p>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: token.colorBgContainerDisabled,
              height: "50px",
              width: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <GlobalOutlined style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3
              style={{ fontSize: "20px", marginBottom: "!0" }}
              // className='mb-0!'
            >
              6
            </h3>
            <p>Total Zones</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChargeCard;
