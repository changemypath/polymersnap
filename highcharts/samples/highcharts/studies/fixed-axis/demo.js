
/**
 * Highcharts plugin to make the Y axis stay fixed when scrolling the chart
 * horizontally on mobile devices. Supports left and right side axes.
 */
(function (H) {
    H.addEvent(H.Chart.prototype, 'render', function () {
        H.each(this.axes, function (axis) {
            axis.applyFixed();
        });
    });

    H.Axis.prototype.applyFixed = function () {
        var chart = this.chart,
            outerContainer = chart.renderTo.parentNode.parentNode,
            width,
            left;

        if (!this.horiz && this.options.fixed) {

            // First render
            if (!this.fixedDiv) {

                this.fixedDiv = H.createElement(
                    'div',
                    {
                        className: 'highcharts-fixed'
                    },
                    {
                        position: 'absolute',
                        overflow: 'hidden',
                        zIndex: 2
                    },
                    null,
                    true
                );
                outerContainer.insertBefore(
                    this.fixedDiv,
                    this.chart.renderTo.parentNode
                );

                this.axisRenderer = new H.Renderer(
                    this.fixedDiv,
                    0,
                    0
                );

                this.background = chart.renderer.rect()
                    .attr({
                        fill: 'rgba(255,255,255,0.85)',
                        zIndex: -1
                    })
                    .add(this.axisGroup);

                this.axisGroup.add(this.axisRenderer.boxWrapper);
                this.labelGroup.add(this.axisRenderer.boxWrapper);
            }

            // Update positions
            width = this.opposite ?
                chart.chartWidth - chart.plotWidth - chart.plotLeft :
                chart.plotLeft;
            left = this.opposite ?
                chart.plotLeft + chart.plotWidth :
                0;

            if (this.opposite) {
                this.fixedDiv.style.left = Math.min(
                    0,
                    outerContainer.offsetWidth - chart.chartWidth
                ) + 'px';
                this.fixedDiv.style.width = chart.chartWidth + 'px';
            }

            this.fixedDiv.style.clip = 'rect(0,' + (left + width) + 'px,' +
                chart.chartHeight + 'px,' + left + 'px)';

            this.background.attr({
                x: left + 'px',
                y: chart.plotTop - 1,
                width: width,
                height: chart.plotHeight + 2
            });
            this.axisRenderer.setSize(
                chart.chartWidth,
                chart.chartHeight
            );
        }
    };
}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Fixed Y axis'
    },
    subtitle: {
        text: 'Open on mobile and scroll sideways'
    },
    xAxis: {
        type: 'datetime',
        labels: {
            overflow: 'justify'
        }
    },
    yAxis: {
        fixed: true,
        tickWidth: 1,
        title: {
            text: 'Wind speed (m/s)'
        },
        lineWidth: 1
    },
    tooltip: {
        valueSuffix: ' m/s'
    },
    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            },
            marker: {
                enabled: false
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2015, 4, 31, 0, 0, 0)
        }
    },
    series: [{
        name: 'Hestavollane',
        data: [0.2, 0.8, 0.8, 0.8, 1, 1.3, 1.5, 2.9, 1.9, 2.6, 1.6, 3, 4, 3.6, 5.5, 6.2, 5.5, 4.5, 4, 3.1, 2.7, 4, 2.7, 2.3, 2.3, 4.1, 7.7, 7.1, 5.6, 6.1, 5.8, 8.6, 7.2, 9, 10.9, 11.5, 11.6, 11.1, 12, 12.3, 10.7, 9.4, 9.8, 9.6, 9.8, 9.5, 8.5, 7.4, 7.6]

    }, {
        name: 'Vik',
        data: [0, 0, 0.6, 0.9, 0.8, 0.2, 0, 0, 0, 0.1, 0.6, 0.7, 0.8, 0.6, 0.2, 0, 0.1, 0.3, 0.3, 0, 0.1, 0, 0, 0, 0.2, 0.1, 0, 0.3, 0, 0.1, 0.2, 0.1, 0.3, 0.3, 0, 3.1, 3.1, 2.5, 1.5, 1.9, 2.1, 1, 2.3, 1.9, 1.2, 0.7, 1.3, 0.4, 0.3]
    }],
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
});