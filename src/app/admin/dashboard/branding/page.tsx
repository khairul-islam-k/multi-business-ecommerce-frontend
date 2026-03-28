import {
    Card,
    Col,
    Row
} from 'antd';
import React from 'react';

const BusinessBranding = () => {
    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card>
                        123
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card>
                        124
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BusinessBranding;