import { assert } from "chai";
import { QpNode } from "../src/node";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";

describe("QpNode", () => {

    describe("Constructor", () => {

        it("Throws if element is null", () => {

            assert.throws(() => new QpNode(null));

        });

        it("Throws if element is not .qp-node", () => {

            assert.throws(() => new QpNode(document.createElement("div")));

        });

    });

    describe("children property", () => {

        it("Is an array with one element for each child node", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(3, helper.findNodeById(container, "0").children.length);
            assert.equal(0, helper.findNodeById(container, "2").children.length);
            assert.equal(1, helper.findNodeById(container, "3").children.length);
    
        });

        it("Contains elements of type QpNode", () => {

            let container = helper.showPlan(plan.adaptive_join);
            var child = helper.findNodeById(container, "0").children[0];
            assert.instanceOf(child, QpNode);
            
        });

    });

    describe("nodeId property", () => {

        it("gets the data-node-id attribute if present", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal("3", helper.findNodeById(container, "3").nodeId);
            
        });
        
        it("Returns null if the data-node-id is not present", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(null, helper.findStatement(container).nodeId);

        });
        
    });
    
    describe("queryPlan property", () => {

        it("Returns the query plan XML", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let planXml = helper.findNodeById(container, "2").queryPlan;
            assert.equal("1.6", planXml.getElementsByTagName("ShowPlanXML")[0].attributes["Version"].value);

        });

    });

    describe("relOpXml property", () => {

        it("Returns the XML for the node RelOp", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let xml = helper.findNodeById(container, "2").relOpXml;
            assert.equal("0.0110168", xml.attributes["EstimateCPU"].value);

        });

    });
    
    describe("actualRows property", () => {

        it("Returns a sum of @ActualRows from runtime information", () => {

            let adaptiveJoin = helper.showPlan(plan.adaptive_join);
            assert.equal(0, helper.findNodeById(adaptiveJoin, "3").actualRows);
            assert.equal(10, helper.findNodeById(adaptiveJoin, "2").actualRows);

            let batchMode = helper.showPlan(plan.batchMode);
            assert.equal(10000000, helper.findNodeById(batchMode, "1").actualRows);

        });

        it("Returns null if there is no runtime information", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(null, helper.findNodeById(container, "3").actualRows);

        });

    });

    describe("estimateRows property", () => {

        it("Returns the estimated number of rows", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(1.0001, helper.findNodeById(container, "7").estimatedRows);

        });

    });

    describe("estimatedRowSize property", () => {

        it("Returns the estimated row size in bytes", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(11, helper.findNodeById(container, "0").estimatestimatedRowSize);
            assert.equal(15, helper.findNodeById(container, "2").estimatestimatedRowSize);
            assert.equal(11, helper.findNodeById(container, "3").estimatestimatedRowSize);
            assert.equal(11, helper.findNodeById(container, "4").estimatestimatedRowSize);
            assert.equal(9, helper.findNodeById(container, "7").estimatestimatedRowSize);

        });

    });

    describe("estimatedDataSize property", () => {

        it("Returns estimated row size * estimated number of rows", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(110, helper.findNodeById(container, "0").estimatedDataSize);
            assert.equal(150, helper.findNodeById(container, "2").estimatedDataSize);
            assert.equal(110, helper.findNodeById(container, "3").estimatedDataSize);
            assert.equal(1100000, helper.findNodeById(container, "4").estimatedDataSize);
            assert.equal(9, helper.findNodeById(container, "7").estimatedDataSize);

        });

    });

});