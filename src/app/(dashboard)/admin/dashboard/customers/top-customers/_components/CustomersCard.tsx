import {
  Banknote,
  ShieldCheck,
  ShoppingCart
} from "lucide-react";
import { Card, Grid, theme } from "antd";

const CustomersCard = () => {
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
            <Banknote style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>$600.9k</h3>
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
            <ShoppingCart style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>8,260</h3>
            <p>Units Sold</p>
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
            <ShieldCheck style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h3
              style={{ fontSize: "20px", marginBottom: "!0" }}
              // className='mb-0!'
            >
              4.4
            </h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomersCard;
