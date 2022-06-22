import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import "../styles/DishesForm.css";
import normalizeDuration from "../normalizers/nomalizeDuration";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.preparation_time) {
    errors.preparation_time = "Required";
  } else if (
    !/[0-9][0-9]:[0-5][0-9]:[0-5][0-9]/.test(values.preparation_time)
  ) {
    errors.preparation_time = "Invalid duration format (hh:mm:ss)";
  }

  if (!values.type) {
    errors.type = "Required";
  }

  if ((values.type === "pizza") & !values.no_of_slices) {
    errors.no_of_slices = "Required";
  }
  if ((values.type === "pizza") & !values.diameter) {
    errors.diameter = "Required";
  }
  if ((values.type === "soup") & !values.spiciness_scale) {
    errors.spiciness_scale = "Required";
  }
  if ((values.type === "sandwich") & !values.slices_of_bread) {
    errors.slices_of_bread = "Required";
  }
  return errors;
};

const warn = (values) => {
  const warnings = {};
  if ((values.type === "sandwich") & (values.slices_of_bread === "1")) {
    warnings.slices_of_bread = "Is a 1 slice sandwich really a sandwich?";
  }
  if ((values.type === "soup") & (values.spiciness_scale === "10")) {
    warnings.spiciness_scale = "That's reaaaaally spicy, are you sure?";
  }
  return warnings;
};

const renderField = ({
  input,
  id,
  label,
  type,
  min,
  max,
  step,
  placeholder,
  meta: { touched, error, warning, active, valid },
  children,
}) => (
  <div className="input_div">
    <label>{label}</label>
    <div>
      <input
        {...input}
        id={id}
        placeholder={placeholder}
        type={type}
        min={min}
        max={max}
        step={step}
        isactive={active ? "true" : "false"}
        isvalid={valid ? "true" : "false"}
        error={touched ? (error ? "true" : "false") : undefined}
        warning={touched ? (warning ? "true" : "false") : undefined}
      />
      {children}
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const selectField = ({
  input,
  id,
  className,
  label,
  meta: { touched, error },
  children,
}) => (
  <div className="input_div">
    <label>{label}</label>
    <div className={className}>
      <select {...input} id={id}>
        {children}
      </select>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

let DishesForm = (props) => {
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    typeValue,
    spiciness_scaleValue,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="name"
        id="name"
        component={renderField}
        type="text"
        label="Dish name"
        placeholder="Dish name"
      ></Field>
      <Field
        name="preparation_time"
        id="preparation_time"
        component={renderField}
        type="text"
        label="Preparation time"
        placeholder="00:00:00"
        normalize={normalizeDuration}
      ></Field>
      <Field
        name="type"
        id="type"
        component={selectField}
        label="Choose a dish"
        className="selectArrow"
      >
        <option />
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </Field>

      {typeValue === "pizza" && (
        <div className="w100">
          <Field
            name="no_of_slices"
            id="no_of_slices"
            component={renderField}
            type="number"
            min="0"
            step="1"
            label="Number of slices ?"
          ></Field>
          <Field
            name="diameter"
            id="diameter"
            component={renderField}
            type="number"
            min="0"
            step="0.1"
            label="Diameter of the pizza ?"
          ></Field>
        </div>
      )}

      {typeValue === "soup" && (
        <>
          <Field
            name="spiciness_scale"
            id="spiciness_scale"
            component={renderField}
            type="range"
            min="1"
            max="10"
            step="1"
            label="Spiciness (1-10):"
          >
            <p>{spiciness_scaleValue ? spiciness_scaleValue : "?"}</p>
          </Field>
        </>
      )}

      {typeValue === "sandwich" && (
        <Field
          name="slices_of_bread"
          id="slices_of_bread"
          component={renderField}
          type="number"
          min="1"
          step="1"
          label="How many slices of bread?"
        ></Field>
      )}

      <div className="controls">
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
        <button type="button" onClick={reset} disabled={pristine || submitting}>
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </form>
  );
};

DishesForm = reduxForm({
  form: "dishes",
  validate,
  warn,
})(DishesForm);

const selector = formValueSelector("dishes");

DishesForm = connect((state) => {
  const typeValue = selector(state, "type");
  const spiciness_scaleValue = selector(state, "spiciness_scale");
  return {
    typeValue,
    spiciness_scaleValue,
  };
})(DishesForm);

export default DishesForm;
