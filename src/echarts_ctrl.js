import { PanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import echarts from './libs/echarts';
import './libs/echarts-liquidfill';
import './libs/dark';
import './libs/china';
import './libs/beijing';

export class EchartsCtrl extends PanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        const panelDefaults = {
            EchartsOption: 'option = {}'
        };

        _.defaults(this.panel, panelDefaults);

        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-initialized', this.render.bind(this));
    }

    dataChanged(){
        this.IS_DATA_CHANGED = true;
        this.render();
        this.IS_DATA_CHANGED = false;
    }

    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/grafana-echarts-panel/editor.html', 2);
    }

    link(scope, elem, attrs, ctrl) {
        const $panelContainer = elem.find('.echarts_container')[0];
        let option = {};

        ctrl.IS_DATA_CHANGED = true;

        //init height
        let height = ctrl.height || panel.height || ctrl.row.height;
        if (_.isString(height)) {
            height = parseInt(height.replace('px', ''), 10);
        }
	    height -= 5;
	    height -= ctrl.panel.title ? 24 : 9;
        $panelContainer.style.height = height + 'px';

        //init width
        let width = document.body.clientWidth;
        width = (width - 5.6 * 2) * ctrl.panel.span / 12 - 5.6 * 2 - 1 * 2 - 10 * 2;
        $panelContainer.style.width = width + 'px';

        //init echarts
        let myChart = echarts.init($panelContainer, 'dark');

        //替代eval
        function evil(fn) {
            var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
            return new Fn('return ' + fn)();
        }

        function render() {
            if (!myChart) {
                return;
            }

            myChart.resize();
            if (ctrl.IS_DATA_CHANGED) {
                myChart.clear();
            }

            eval(ctrl.panel.EchartsOption);
            // evil(ctrl.panel.EchartsOption);

            myChart.setOption(option);
        }

        this.events.on('render', function () {
            render();
            ctrl.renderingCompleted();
        });
    }
}

EchartsCtrl.templateUrl = 'module.html';
