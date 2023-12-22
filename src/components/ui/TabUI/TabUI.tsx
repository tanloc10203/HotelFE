import { Box, Tab, Tabs, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactNode, SyntheticEvent, useCallback } from "react";

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const StyledBadge = styled("div")<{ bgColor: string; color: string }>(({ bgColor, color }) => ({
  padding: "0px 6px",
  borderRadius: 6,
  fontSize: 14,
  minWidth: 24,
  height: 24,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  background: bgColor,
  color: color,
  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
}));

export type TabOptions = {
  label: ReactNode;
  id: number;
  bg: string;
  bgActive: string;
  color: string;
  colorActive: string;
};

export type TabUIProps = {
  tabsData: TabOptions[];
  value: number;
  onChange?: (value: number) => void;
};

const TabUI: FC<TabUIProps> = ({ tabsData, value, onChange }) => {
  const handleChange = useCallback((_: SyntheticEvent, newValue: number) => {
    if (!onChange) return;
    onChange(newValue);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
          {!tabsData?.length ? (
            <Typography>Tab data không có dữ liệu</Typography>
          ) : (
            tabsData.map((tab) => (
              <Tab
                TouchRippleProps={{ style: { padding: 0 } }}
                key={tab.id}
                label={
                  <Box display={"flex"} gap={1}>
                    <Typography fontWeight={700} fontSize={14}>
                      {tab.label}
                    </Typography>
                    {/* <StyledBadge
                      color={value === tab.id ? tab.colorActive : tab.color}
                      bgColor={value === tab.id ? tab.bgActive : tab.bg}
                    >
                      4
                    </StyledBadge> */}
                  </Box>
                }
                {...a11yProps(tab.id)}
              />
            ))
          )}
        </Tabs>
      </Box>
    </Box>
  );
};

export default TabUI;
