import React, { useEffect } from 'react';

const Calculator = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.inchcalculator.com/e/widgets.min.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="inch-calculator-icw" className='border-0 mt-4' data-ct="bmr" data-cw="100%" data-ch="870" data-cv="MTE3MTM0NzkwNjA=">
            <div id="inch-calculator-icwh">BMR Calculator</div>
            <div id="inch-calculator-icwf">
                <a id="inch-calculator-icwi" href="https://www.inchcalculator.com/bmr-calculator/" target="_blank">
                    <img id="inch-calculator-icwl" src="https://cdn.inchcalculator.com/e/inch-calculator-logo-tiny.png" alt="Inch Calculator Logo" width="40" height="49" />
                    <span id="inch-calculator-icwb">Inch Calculator</span>
                </a>
            </div>
        </div>
    );
};

export default Calculator;
