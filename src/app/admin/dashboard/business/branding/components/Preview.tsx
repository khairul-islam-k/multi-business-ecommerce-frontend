import { Card } from 'antd';
import React from 'react';

interface PreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const Preview: React.FC<PreviewProps> = ({primaryColor, secondaryColor, accentColor}) => {
    return (
        <div>
            <h3>Preview</h3>
            <Card>
                <div style={{
                    background: primaryColor,
                    height: '20px',
                    marginBottom: '10px'
                }}></div>

                
                <div style={{
                    background: secondaryColor,
                    height: '20px',
                    marginBottom: '10px'
                }}></div>

                
                <div style={{
                    background: accentColor,
                    height: '20px',
                    marginBottom: '10px'
                }}></div>

            </Card>
        </div>
    );
};

export default Preview;