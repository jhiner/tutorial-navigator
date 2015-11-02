import { createMockComponentContext } from 'fluxible/utils';
import TutorialStore from '../src/stores/TutorialStore';
import TutorialNavigator from '../src/components/TutorialNavigator';
import loadSettingsAction from '../src/action/loadSettingsAction'
import assert from 'assert';
import Fluxible from 'fluxible';
import { createElementWithContext } from 'fluxible-addons-react';
import jsdom from 'jsdom';

describe('Tutorial Navigator Test', function () {
    var componentContext;
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react/lib/ReactTestUtils');
    var provideContext = require('fluxible-addons-react/provideContext');
    var connectToStores = require('fluxible-addons-react/connectToStores');
    var context;

    beforeEach(function (done) {
        var app = new Fluxible({
            component: TutorialNavigator
        });
        app.registerStore(TutorialStore);
        context = app.createContext();
        done();
    });

    // afterEach(function () {
    //     delete global.window;
    //     delete global.document;
    //     delete global.navigator;
    //     context = null;
    // });

    it('Store should be registered', function (done) {
      var storeInstance = context.getStore(TutorialStore);
      assert.notEqual(storeInstance, 'undefined');
      done();
    });

    it('Should create Tutorial Navigator basic structure with context', function (done) {
      var platforms = JSON.parse('{"apptypes":[], "clientPlatforms":[],"nativePlatforms":[],"serverPlatforms":[]}');
      context.getActionContext().executeAction(loadSettingsAction, {
        quickstart: platforms,
        baseUrl: 'http://localhost:5050'
      }).then(() =>{
        var component = ReactTestUtils.renderIntoDocument(
            createElementWithContext(context)
        );

        var elements = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'container');
        assert(2 == elements.length);
        done();
      })
    });

    it('Should create Tutorial Navigator structure with context and only one quickstart', function (done) {
      var platforms = JSON.parse('{"apptypes":[{"title":"Title1","name":"Name1","description":"Description1","example":"e.g.1","budicon":243}], "clientPlatforms":[],"nativePlatforms":[],"serverPlatforms":[]}');
      context.getActionContext().executeAction(loadSettingsAction, {
        quickstart: platforms,
        baseUrl: 'http://localhost:5050'
      }).then(() =>{
        var component = ReactTestUtils.renderIntoDocument(
            createElementWithContext(context)
        );

        var elements = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'quickstart');
        assert(1 == elements.length);

        var quickstart = ReactDOM.findDOMNode(elements[0]);
        assert("Title1" == quickstart.querySelector('.title').innerHTML);
        assert("Description1" == quickstart.querySelector('.description').innerHTML);
        assert("e.g.1" == quickstart.querySelector('.sample').innerHTML);
        done();
      })
    });

    it('Should create Tutorial Navigator and there shouldnt be breadcrumbs', function (done) {
      var platforms = {
        "apptypes":[ {
          "title":"Title1",
          "name":"Name1",
          "description":"Description1",
          "example":"e.g.1",
          "budicon":243}
        ],
        "clientPlatforms":[],
        "nativePlatforms":[],
        "serverPlatforms":[]
      };
      context.getActionContext().executeAction(loadSettingsAction, {
        quickstart: platforms,
        baseUrl: 'http://localhost:5050'
      }).then(() =>{
        var component = ReactTestUtils.renderIntoDocument(
            createElementWithContext(context)
        );

        var elements = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'breadcrumbs');
        assert(0 == elements.length);

        if (component && component.isMounted()) {
          // Only components with a parent will be unmounted
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode);
        }
        done();
      })
    });

    it('On quickstart click should render Tech list', function (done) {
      var platforms = {
        "apptypes":[ {
          "title":"Title1",
          "name":"Name1",
          "description":"Description1",
          "example":"e.g.1",
          "budicon":243}
        ],
        "clientPlatforms":[ {
          "title":"Tech1",
          "name":"TechName1",
          "url":"/some-path",
          "image":"/an-image-path.png"
         }],
        "nativePlatforms":[],
        "serverPlatforms":[]
      };
      context.getActionContext().executeAction(loadSettingsAction, {
        quickstart: platforms,
        baseUrl: 'http://localhost:5050'
      }).then(() =>{
        var component = ReactTestUtils.renderIntoDocument(
            createElementWithContext(context)
        );

        context.getActionContext().executeAction(ArticleLoadAction, {
          appType : "name1"
        });

        var techElements = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'circle-logo');
        console.log(techElements);
        var tech = ReactDOM.findDOMNode(techElements);
        // ReactTestUtils.Simulate.click(quickstart);

        console.log(tech);
        // assert("Tech1" == );

        // var techElement = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'circle-logo')
        // assert('undefined' !== techElement);
        //
        // var tech = ReactDOM.findDOMNode(techElement);
        // assert("Tech1" == quickstart.querySelector('.title').innerHTML);
        done();
      })
    });
});
