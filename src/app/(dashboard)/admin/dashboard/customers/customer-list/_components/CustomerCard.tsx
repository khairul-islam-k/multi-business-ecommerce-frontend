import {
  Banknote,
  TriangleAlert,
  UserRoundX,
  Users
} from "lucide-react";
import { Card, Grid, theme } from "antd";

const CustomerCard = () => {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: screens.xs ? "repeat(1, 1fr)" : "repeat(4, 1fr)",
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
            <Users style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>8</h3>
            <p>Total Customers</p>
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
            <Banknote style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>Rs 1072K</h3>
            <p>Total Revenue</p>
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
            <UserRoundX style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3
              style={{ fontSize: "20px", marginBottom: "!0" }}
              // className='mb-0!'
            >
              345
            </h3>
            <p>Total Orders</p>
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
            <TriangleAlert style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3
              style={{ fontSize: "20px", marginBottom: "!0" }}
              // className='mb-0!'
            >
              1
            </h3>
            <p>Inactive</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerCard;
